export default function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Active'
      ? 'active'
      : status === 'Closed'
      ? 'closed'
      : status === 'Solved'
      ? 'solved'
      : status === 'Open'
      ? 'open'
      : 'unsolved';
  return <span className={`badge ${cls}`}>{status}</span>;
}
