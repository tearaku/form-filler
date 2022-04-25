export function parseDateString(dateStr: string): string {
  return dateStr.substring(0, dateStr.indexOf("T"))
}

export function mapEventRoleEnum(role: string): string {
  switch (role) {
    case "Host":
      return "領隊"
    case "Mentor":
      return "輔領"
    case "Member":
      return "出隊成員"
    case "Rescue":
      return "山難"
    case "Watcher":
      return "留守"
    default:
      return ""
  }
}