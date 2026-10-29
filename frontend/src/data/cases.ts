// 50 个验证用例的文件清单（由后端 validation/cases 自动生成），前端按此路径取文件。
export interface CaseFile { id: string; docFile: string; docBytes: number; has_table: boolean; has_image: boolean; }
export const CASE_FILES: CaseFile[] = [
  {
    "id": "contract_00",
    "docFile": "document.md",
    "docBytes": 441,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "contract_01",
    "docFile": "document.txt",
    "docBytes": 441,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "contract_02",
    "docFile": "document.docx",
    "docBytes": 38123,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "contract_03",
    "docFile": "document.md",
    "docBytes": 433,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "contract_04",
    "docFile": "document.docx",
    "docBytes": 36968,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "email_00",
    "docFile": "document.md",
    "docBytes": 245,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "email_01",
    "docFile": "document.txt",
    "docBytes": 238,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "email_02",
    "docFile": "document.docx",
    "docBytes": 37960,
    "has_table": false,
    "has_image": true
  },
  {
    "id": "email_03",
    "docFile": "document.md",
    "docBytes": 238,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "email_04",
    "docFile": "document.docx",
    "docBytes": 36821,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "invoice_00",
    "docFile": "document.md",
    "docBytes": 311,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "invoice_01",
    "docFile": "document.txt",
    "docBytes": 295,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "invoice_02",
    "docFile": "document.docx",
    "docBytes": 38041,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "invoice_03",
    "docFile": "document.md",
    "docBytes": 299,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "invoice_04",
    "docFile": "document.md",
    "docBytes": 333,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "job_00",
    "docFile": "document.md",
    "docBytes": 276,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "job_01",
    "docFile": "document.txt",
    "docBytes": 271,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "job_02",
    "docFile": "document.docx",
    "docBytes": 38027,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "job_03",
    "docFile": "document.md",
    "docBytes": 275,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "job_04",
    "docFile": "document.txt",
    "docBytes": 309,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "meeting_00",
    "docFile": "document.md",
    "docBytes": 209,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "meeting_01",
    "docFile": "document.txt",
    "docBytes": 202,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "meeting_02",
    "docFile": "document.docx",
    "docBytes": 37972,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "meeting_03",
    "docFile": "document.md",
    "docBytes": 210,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "meeting_04",
    "docFile": "document.docx",
    "docBytes": 36808,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "order_00",
    "docFile": "document.md",
    "docBytes": 290,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "order_01",
    "docFile": "document.txt",
    "docBytes": 280,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "order_02",
    "docFile": "document.docx",
    "docBytes": 38154,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "order_03",
    "docFile": "document.md",
    "docBytes": 280,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "order_04",
    "docFile": "document.md",
    "docBytes": 329,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "product_00",
    "docFile": "document.md",
    "docBytes": 231,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "product_01",
    "docFile": "document.txt",
    "docBytes": 226,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "product_02",
    "docFile": "document.docx",
    "docBytes": 37978,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "product_03",
    "docFile": "document.md",
    "docBytes": 230,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "product_04",
    "docFile": "document.md",
    "docBytes": 264,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "report_00",
    "docFile": "document.md",
    "docBytes": 208,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "report_01",
    "docFile": "document.txt",
    "docBytes": 198,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "report_02",
    "docFile": "document.docx",
    "docBytes": 37950,
    "has_table": false,
    "has_image": true
  },
  {
    "id": "report_03",
    "docFile": "document.md",
    "docBytes": 198,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "report_04",
    "docFile": "document.txt",
    "docBytes": 242,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "resume_00",
    "docFile": "document.md",
    "docBytes": 190,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "resume_01",
    "docFile": "document.txt",
    "docBytes": 186,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "resume_02",
    "docFile": "document.docx",
    "docBytes": 37966,
    "has_table": true,
    "has_image": true
  },
  {
    "id": "resume_03",
    "docFile": "document.md",
    "docBytes": 190,
    "has_table": true,
    "has_image": false
  },
  {
    "id": "resume_04",
    "docFile": "document.txt",
    "docBytes": 207,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "travel_00",
    "docFile": "document.md",
    "docBytes": 213,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "travel_01",
    "docFile": "document.txt",
    "docBytes": 194,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "travel_02",
    "docFile": "document.docx",
    "docBytes": 37961,
    "has_table": false,
    "has_image": true
  },
  {
    "id": "travel_03",
    "docFile": "document.md",
    "docBytes": 194,
    "has_table": false,
    "has_image": false
  },
  {
    "id": "travel_04",
    "docFile": "document.docx",
    "docBytes": 36816,
    "has_table": false,
    "has_image": false
  }
];
export const caseDocUrl = (id: string, docFile: string) => `/validation-cases/${id}/${docFile}`;
export const caseFileUrl = (id: string, name: string) => `/validation-cases/${id}/${name}`;
