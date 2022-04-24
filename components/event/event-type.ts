export type EquipData = {
  name: string,
  des: string,
}

export type Attendant = {
  userId: number,
  eventId: number,
  role: string,
  jobs?: string,
}

export type EventData = {
  title: string,
  beginDate: Date | string,
  endDate: Date | string,
  location: string,
  category: string,
  groupCategory?: string,
  drivers?: string,
  driversNumber?: string,
  radioFreq: string,
  radioCodename: string,
  tripOverview: string,
  rescueTime: string,
  retreatPlan?: string,
  mapCoordSystem: string,
  records: string,

  equip: EquipData[],
  equip_add: EquipData[],
  techEquip: EquipData[],
  techEquip_add: EquipData[],
}

export type EventData_API = {
  title: string,
  beginDate: string | Date,
  endDate: string | Date,
  location: string,
  category: string,
  groupCategory?: string,
  drivers?: string,
  driversNumber?: string,
  radioFreq: string,
  radioCodename: string,
  tripOverview: string,
  rescueTime: string,
  retreatPlan?: string,
  mapCoordSystem: string,
  records: string,

  equipList: string[],
  equipDes: string[],
  techEquipList: string[],
  techEquipDes: string[],
  
  id: number,
  inviteToken: string,
  attendants: Attendant[],
}