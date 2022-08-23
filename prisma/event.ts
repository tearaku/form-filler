import { Prisma } from '@prisma/client'

export const eventData: Prisma.EventCreateInput[] = [
  {
    inviteToken: "zVztX7II4eJi9b0OrV5Zj", // Generated from nanoid()
    title: "Event #1",
    beginDate: new Date(2022, 7, 23, 16, 0, 0, 0),
    endDate: new Date(2022, 7, 28, 16, 0, 0, 0),
    location: "Taipei",
    category: "B勘",
    groupCategory: "天狼",
    drivers: "司機一號、司機二號",
    driversNumber: "0900-111-111, 0900-111-112",
    radioFreq: "145.20 Mhz",
    radioCodename: "浩浩",
    tripOverview: "D0 wwwwwww\nD1 oooooooo\nD2 zzzzzzzzz\nD3 qqqqqq",
    rescueTime: "D5 1800",
    retreatPlan: "C3 沒過ＯＯＸＸ，原路哈哈哈",
    mapCoordSystem: "TWD97 上河",
    records: "[0] ooxx/oo/xx wwoowwoo\n[1] ooxx/xx/oo oxoxoxoxox\n",
    equipList: ["帳棚", "鍋組（含湯瓢、鍋夾）", "爐頭", "Gas", "糧食", "預備糧", "山刀", "鋸子", "路標", "衛星電話", "收音機", "無線電", "傘帶", "Sling", "無鎖鉤環", "急救包", "GPS", "包溫瓶", "ooxx", "xxoo", "ooxx", "xxoo", "ooxx", "xxoo"],
    equipDes: ["1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x", "1x"],
    techEquipList: ["主繩", "吊帶", "上升器", "下降器", "岩盔", "有鎖鉤環", "救生衣", "ooxx", "ooxx", "oxxo", "oxox"],
    techEquipDes: ["1x", "2x", "2x", "2x", "2x", "4x", "4x", "1x", "1x", "1x", "1x"],
  }
]