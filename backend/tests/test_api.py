import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app import main
from backend.app.database import Base


class BackendApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.original_engine = main.engine
        cls.original_session_factory = main.SessionLocal
        main.engine = cls.engine
        main.SessionLocal = sessionmaker(
            bind=cls.engine,
            autoflush=False,
            expire_on_commit=False,
        )

    @classmethod
    def tearDownClass(cls):
        main.engine = cls.original_engine
        main.SessionLocal = cls.original_session_factory
        cls.engine.dispose()

    def setUp(self):
        Base.metadata.drop_all(bind=self.engine)
        self.client_context = TestClient(main.app)
        self.client = self.client_context.__enter__()

    def tearDown(self):
        self.client_context.__exit__(None, None, None)

    def test_approval_decision_is_persisted_once_and_audited(self):
        response = self.client.post(
            "/api/approvals/TASK-9081/decision",
            json={
                "decision": "approve",
                "draft_content": {
                    "recipient": "sponsor@example.test",
                    "subject": "Updated draft",
                    "body": "Reviewed by operator",
                },
            },
        )

        self.assertEqual(response.status_code, 200)
        task = response.json()
        self.assertEqual(task["status"], "approved")
        self.assertEqual(task["executionStatus"], "awaiting_dispatch")
        self.assertEqual(task["draftContent"]["body"], "Reviewed by operator")

        repeated = self.client.post(
            "/api/approvals/TASK-9081/decision",
            json={"decision": "reject"},
        )
        self.assertEqual(repeated.status_code, 409)
        activities = self.client.get("/api/activities").json()
        self.assertTrue(any("Human approved action" in event["action"] for event in activities))

    def test_disconnected_integration_cannot_be_enabled(self):
        response = self.client.patch(
            "/api/integrations/github",
            json={"data_ingestion_active": True},
        )
        self.assertEqual(response.status_code, 409)

        response = self.client.patch(
            "/api/integrations/gdrive",
            json={"data_ingestion_active": False},
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["dataIngestionActive"])

    def test_memory_search_and_workflow_simulation(self):
        response = self.client.get("/api/memory", params={"q": "sponsorship"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["id"], "mem-9401")

        response = self.client.post("/api/workflows/simulate")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [event["step"] for event in response.json()],
            ["Collect", "Understand", "Decide", "Act", "Verify", "Remember"],
        )
        self.assertTrue(
            all("no external actions" in event["details"] for event in response.json())
        )

    def test_health_and_dashboard_endpoints(self):
        self.assertEqual(self.client.get("/health").json()["status"], "ok")
        self.assertEqual(self.client.get("/api/dashboard").json()["pendingApprovals"], 3)
        self.assertEqual(self.client.get("/api/health").status_code, 200)


if __name__ == "__main__":
    unittest.main()
