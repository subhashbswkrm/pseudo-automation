from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Activity, ApprovalTask, Integration, MemoryRecord


def seed_database(db: Session) -> None:
    if db.scalar(select(ApprovalTask.id).limit(1)) is not None:
        return

    tasks = [
        ApprovalTask(
            id="TASK-9081",
            title="Drafted Email to Hackathon Sponsor",
            category="Email Outbound",
            risk_level="high",
            target_entity="sponsorship@cloudscale-ai.io",
            confidence_score=85,
            ai_reasoning=(
                "Matches previous sponsorship templates with 85% vector similarity. "
                "Involves commitment of Platinum Keynote slots ($7,500), exceeding "
                "auto-dispatch limits."
            ),
            agent="Action Agent (n8n node #12)",
            draft_content={
                "recipient": "sponsorship@cloudscale-ai.io",
                "subject": "Partnership Proposal: DevHacks 2026 Title Sponsorship",
                "body": (
                    "Hi Alex,\n\nThank you for reaching out regarding partnership "
                    "opportunities for DevHacks 2026.\n\nBased on CloudScale's "
                    "developer tooling focus, we have reserved a Tier-1 Platinum "
                    "Sponsorship slot for your team. This includes a mainstage "
                    "keynote, a mentor booth, and a custom API challenge.\n\n"
                    "Best regards,\nThe DevHacks Organizing Team"
                ),
            },
            policy_checks=[
                {"rule": "Anti-Hallucination Vector Check", "passed": True},
                {"rule": "Budget Allocation Guardrail (<$10k)", "passed": True},
                {"rule": "Tone & Sentiment (Professional)", "passed": True},
                {"rule": "Outbound Cold Email Quarantine", "passed": False},
            ],
        ),
        ApprovalTask(
            id="TASK-9082",
            title="Elevate Participant to Track Mentor (DB Mutation)",
            category="Database Mutation",
            risk_level="critical",
            target_entity="PostgreSQL: users.role (uid: 8492)",
            confidence_score=79,
            ai_reasoning=(
                "Scout Agent detected ticket #4092 requesting mentor privileges. "
                "Since this grants access to private judging scoreboards, manual "
                "confirmation is enforced."
            ),
            agent="Decision Engine (n8n node #07)",
            draft_content={
                "payloadDiff": [
                    {"field": "role", "oldVal": '"attendee"', "newVal": '"track_mentor"'},
                    {
                        "field": "permissions",
                        "oldVal": '["submit_project"]',
                        "newVal": '["submit_project", "judge_eval", "private_chat"]',
                    },
                    {
                        "field": "verified_by_organizer",
                        "oldVal": "false",
                        "newVal": "true",
                    },
                ]
            },
            policy_checks=[
                {"rule": "Zero Trust Access Rule", "passed": False},
                {"rule": "Identity Verification Match", "passed": True},
                {"rule": "Discord Handle Match", "passed": True},
            ],
        ),
        ApprovalTask(
            id="TASK-9083",
            title="Stripe Refund Trigger: Duplicate Registration Ticket",
            category="Financial Action",
            risk_level="high",
            target_entity="Stripe API: ch_3N8xYkL90",
            confidence_score=92,
            ai_reasoning=(
                "Participant accidentally purchased two hacker badges within 4 "
                "minutes. Matches automated refund heuristic, but payment gateway "
                "trigger requires operator signoff."
            ),
            agent="Action Agent",
            draft_content={
                "recipient": "finance@devhacks.com",
                "subject": "Authorize Refund: Charge #ch_3N8xYkL90 ($45.00 USD)",
                "body": (
                    "Charge ID: ch_3N8xYkL90\nAmount: $45.00 USD\n"
                    "Reason: Duplicate checkout within 4m\n"
                    "User: priya.patel@cs.university.edu"
                ),
            },
            policy_checks=[
                {"rule": "Duplicate Checkout Window (<10m)", "passed": True},
                {"rule": "Cardholder Match", "passed": True},
                {"rule": "Financial Dissemination Gate", "passed": False},
            ],
        ),
    ]
    db.add_all(tasks)

    integrations = [
        ("gmail", "Gmail Suite", "Sensory Email Ingestion", "mail", True, "2 mins ago", 1420, True,
         "Autonomous scanning for sponsorship inquiries, vendor invoices, and participant support tickets."),
        ("gdrive", "Google Drive", "Document Knowledge Base", "drive", True, "14 mins ago", 890, True,
         "Embeds pitch decks, sponsorship tier PDFs, and organizer guideline docs into vector memory."),
        ("calendar", "Google Calendar", "Schedule & Reminders", "calendar", True, "Just now", 320, True,
         "Autonomous scheduling, meeting room booking, and organizer conflict resolution."),
        ("slack", "Slack Workspace", "Internal Team Hub", "slack", True, "1 min ago", 4310, True,
         "Real-time alert relay, #hitl-approvals bot channel, and natural language command parsing."),
        ("postgres", "PostgreSQL DB", "Primary State Store", "database", True, "Live stream", 12840, True,
         "Transactional state tracking, participant registration records, and audit trace logs."),
        ("github", "GitHub Repos", "Code & Dev Tasks", "github", False, "Disconnected", 0, False,
         "Automated PR triage, issue label synchronization, and release notes compilation."),
    ]
    db.add_all(
        Integration(
            id=row[0],
            name=row[1],
            category=row[2],
            icon=row[3],
            connected=row[4],
            last_synced=row[5],
            events_processed=row[6],
            data_ingestion_active=row[7],
            description=row[8],
        )
        for row in integrations
    )

    now = datetime.now(timezone.utc)
    activity_rows = [
        ("ACT-101", "Collect", "Scout Agent", "scout", "Processing Gmail payload #8492",
         "Scraped raw MIME email from sponsorship@cloudscale-ai.io. Extracted 4 token fragments.",
         "completed", 98),
        ("ACT-102", "Understand", "Interpreter Agent", "interpreter",
         "Intent Classification: Partnership Ingestion",
         'Identified entity: "CloudScale AI", category: "Tier 1 Platinum Request", sentiment: 0.94 positive.',
         "completed", 184),
        ("ACT-103", "Decide", "Context Agent", "context", "Matching Vectors in Qdrant",
         "Retrieved 3 previous sponsorship email templates (85% cosine similarity). Risk score evaluated: HIGH.",
         "needs_approval", 142),
        ("ACT-104", "Act", "Action Agent", "action", "Dispatched Discord Notification",
         'Sent webhook message to #organizers channel: "New sponsor inquiry registered".',
         "completed", 65),
        ("ACT-105", "Verify", "Verifier Agent", "verifier", "Pre-flight Policy & Schema Check",
         "Evaluated SPF/DKIM headers & guardrail limits. Passed 3/4 rules.",
         "completed", 44),
        ("ACT-106", "Remember", "Memory Base", "memory", "Persisted to Episodic Cluster",
         "Saved interaction state to the configured memory store.",
         "completed", 112),
    ]
    db.add_all(
        Activity(
            id=row[0],
            timestamp=now,
            step=row[1],
            agent=row[2],
            agent_role=row[3],
            action=row[4],
            details=row[5],
            status=row[6],
            latency_ms=row[7],
        )
        for row in activity_rows
    )

    memories = [
        ("mem-9401", "Semantic Vector", "Sponsorship Negotiations",
         "Hackathon Tier 1 ($10,000) packages include keynote slots, custom workshop tracks, and direct resume book access.",
         "Context Agent"),
        ("mem-9402", "Behavioral Rule", "Tone & Policy Guardrail",
         "Never auto-send emails with financial figures above $1,000 without triggering the Human-in-the-Loop Quarantine Gate.",
         "Verifier Agent"),
        ("mem-9403", "Episodic Memory", "Previous Hackathon Feedback",
         "Previous AWS representative requested 48-hour advance notice for mentor table allocations.",
         "Memory Base"),
        ("mem-9404", "Semantic Vector", "Participant Support QA",
         "Hardware lab distribution starts at 9:00 AM on Saturday at Booth B4. Arduino & ESP32 kits require student ID deposit.",
         "Interpreter Agent"),
    ]
    db.add_all(
        MemoryRecord(
            id=row[0],
            type=row[1],
            cluster=row[2],
            snippet=row[3],
            agent=row[4],
            updated_at=now,
        )
        for row in memories
    )
    db.commit()
