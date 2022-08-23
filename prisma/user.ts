import { Prisma } from '@prisma/client'

const profileData = [
  {
    isMale: true,
    isStudent: true,
    majorYear: "昆蟲四",
    dateOfBirth: new Date("2000-2-5"),
    placeOfBirth: "呵呵市",
    isTaiwanese: true,
    nationalId: "A12345678",
    address: "呵呵地址",
    emergencyContactName: "緊急一",
    emergencyContactMobile: "0900-000-000",
    emergencyContactPhone: "04-0000000",
    beneficiaryName: "受益一",
    beneficiaryRelation: "母子",
    riceAmount: 4,
    foodPreference: "喜歡辣"
  },
  {
    isMale: false,
    isStudent: true,
    majorYear: "中文一",
    dateOfBirth: new Date("2004-2-5"),
    placeOfBirth: "呵呵市",
    isTaiwanese: true,
    nationalId: "A12345678",
    address: "呵呵地址",
    emergencyContactName: "緊急二",
    emergencyContactMobile: "0900-000-001",
    emergencyContactPhone: "無",
    beneficiaryName: "受益二",
    beneficiaryRelation: "父女",
    riceAmount: 2,
  },
  {
    engName: "Matthews Brittney",
    isMale: true,
    isStudent: false,
    dateOfBirth: new Date("1995-2-5"),
    placeOfBirth: "呵呵國",
    isTaiwanese: false,
    nationality: "香港",
    passportNumber: "P12345678",
    address: "呵呵地址",
    emergencyContactName: "緊急三",
    emergencyContactMobile: "0900-000-002",
    emergencyContactPhone: "04-0000002",
    beneficiaryName: "受益三",
    beneficiaryRelation: "父子",
    riceAmount: 6,
    foodPreference: "飯多一點"
  },
  {
    engName: "Cole Schriber",
    isMale: false,
    isStudent: false,
    dateOfBirth: new Date("1990-2-5"),
    placeOfBirth: "呵呵國",
    isTaiwanese: false,
    nationality: "奧門",
    passportNumber: "P87654321",
    address: "呵呵地址",
    emergencyContactName: "緊急四",
    emergencyContactMobile: "0900-000-003",
    emergencyContactPhone: "04-0000003",
    beneficiaryName: "受益四",
    beneficiaryRelation: "母女",
    riceAmount: 3,
  },
]

const minProfileData = [
  {
    name: "一號君",
    mobileNumber: "0910-000-000",
    phoneNumber: "01-0000000",
  },
  {
    name: "二號君",
    mobileNumber: "0910-000-001",
    phoneNumber: "01-0000001",
  },
  {
    name: "三號君",
    mobileNumber: "0910-000-002",
    phoneNumber: "01-0000002",
  },
  {
    name: "四號君",
    mobileNumber: "0910-000-003",
    phoneNumber: "01-0000003",
  },
  {
    name: "半號一君",
    mobileNumber: "0910-000-004",
    phoneNumber: "01-0000004",
  },
  {
    name: "半號二君",
    mobileNumber: "0910-000-005",
    phoneNumber: "01-0000005",
  },
  {
    name: "半號三君",
    mobileNumber: "0910-000-006",
    phoneNumber: "01-0000006",
  },
]

export const userData: Prisma.UserCreateInput[] = [
  {
    name: "一號君",
    email: "num1@hotmail.com",
    profile: {
      create: {
        ...profileData[0]
      }
    },
    minProfile: {
      create: {
        ...minProfileData[0]
      }
    },
    department: {
      create: {
        description: "社長",
      }
    }
  },
  {
    name: "二號君",
    email: "num2@hotmail.com",
    profile: {
      create: {
        ...profileData[1]
      }
    },
    minProfile: {
      create: {
        ...minProfileData[1]
      }
    },
    department: {
      create: {
        description: "嚮導部長1",
      }
    },
  },
  {
    name: "三號君",
    email: "num3@hotmail.com",
    profile: {
      create: {
        ...profileData[2]
      }
    },
    minProfile: {
      create: {
        ...minProfileData[2]
      }
    },
    department: {
      create: {
        description: "嚮導部長2",
      }
    },
  },
  {
    name: "四號君",
    email: "num4@hotmail.com",
    profile: {
      create: {
        ...profileData[3]
      }
    },
    minProfile: {
      create: {
        ...minProfileData[3]
      }
    },
    department: {
      create: {
        description: "社產組長",
      }
    },
  },
  {
    name: "半號一君",
    email: "num5@hotmail.com",
    minProfile: {
      create: {
        ...minProfileData[4]
      }
    },
    department: {
      create: {
        description: "山難部長",
      }
    },
  },
  {
    name: "半號二君",
    email: "num6@hotmail.com",
    minProfile: {
      create: {
        ...minProfileData[5]
      }
    }
  },
  {
    name: "半號三君",
    email: "num7@hotmail.com",
    minProfile: {
      create: {
        ...minProfileData[6]
      }
    }
  },
]