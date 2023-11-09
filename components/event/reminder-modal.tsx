import Link from "next/link";
import ReminderText from "../reminder";

export default function EventReminderModal() {
  return (
    <dialog className="modal" id="event_creation_reminder_modal">
      <div className="modal-box">
        <ReminderText />
        <div className="btn btn-success btn-outline btn-block">
          <Link href="/event/create">
            <a>確認</a>
          </Link>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
