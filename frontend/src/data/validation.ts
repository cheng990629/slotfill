// 由后端验证集报告自动生成（validation/report.json，代码档），不要手改分数。
// 生成时间对应的后端实测：整体 0.9775，结构化 1.0，错版 0.8875。
export const VALIDATION_SUMMARY = {
  overall: 0.9775,
  totalElapsed: 0.391,
  avgElapsed: 0.0078,
  byType: {"contract": 0.975, "email": 0.96, "invoice": 0.9333, "job": 0.9667, "meeting": 1.0, "order": 1.0, "product": 0.98, "report": 0.96, "resume": 1.0, "travel": 1.0},
  byFormat: {"md": 0.9812, "txt": 0.9718, "docx": 0.9768},
  byStyle: {"structured": 1.0, "malformed": 0.8875},
};
export interface ValidationCase { id: string; type: string; format: string; style: string; score: number; elapsed: number; missing: string[]; }
export const VALIDATION_CASES: ValidationCase[] = [
  {
    "id": "contract_00",
    "type": "contract",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.005,
    "missing": []
  },
  {
    "id": "contract_01",
    "type": "contract",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.002,
    "missing": []
  },
  {
    "id": "contract_02",
    "type": "contract",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.077,
    "missing": []
  },
  {
    "id": "contract_03",
    "type": "contract",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "contract_04",
    "type": "contract",
    "format": "docx",
    "style": "malformed",
    "score": 0.875,
    "elapsed": 0.022,
    "missing": []
  },
  {
    "id": "email_00",
    "type": "email",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "email_01",
    "type": "email",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "email_02",
    "type": "email",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.024,
    "missing": []
  },
  {
    "id": "email_03",
    "type": "email",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "email_04",
    "type": "email",
    "format": "docx",
    "style": "malformed",
    "score": 0.8,
    "elapsed": 0.015,
    "missing": []
  },
  {
    "id": "invoice_00",
    "type": "invoice",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "invoice_01",
    "type": "invoice",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "invoice_02",
    "type": "invoice",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.02,
    "missing": []
  },
  {
    "id": "invoice_03",
    "type": "invoice",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "invoice_04",
    "type": "invoice",
    "format": "md",
    "style": "malformed",
    "score": 0.6666666666666666,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "job_00",
    "type": "job",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "job_01",
    "type": "job",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "job_02",
    "type": "job",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.023,
    "missing": []
  },
  {
    "id": "job_03",
    "type": "job",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "job_04",
    "type": "job",
    "format": "txt",
    "style": "malformed",
    "score": 0.8333333333333334,
    "elapsed": 0.002,
    "missing": [
      "location"
    ]
  },
  {
    "id": "meeting_00",
    "type": "meeting",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.0,
    "missing": []
  },
  {
    "id": "meeting_01",
    "type": "meeting",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.0,
    "missing": []
  },
  {
    "id": "meeting_02",
    "type": "meeting",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.022,
    "missing": []
  },
  {
    "id": "meeting_03",
    "type": "meeting",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "meeting_04",
    "type": "meeting",
    "format": "docx",
    "style": "malformed",
    "score": 1.0,
    "elapsed": 0.024,
    "missing": []
  },
  {
    "id": "order_00",
    "type": "order",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "order_01",
    "type": "order",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "order_02",
    "type": "order",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.018,
    "missing": []
  },
  {
    "id": "order_03",
    "type": "order",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "order_04",
    "type": "order",
    "format": "md",
    "style": "malformed",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "product_00",
    "type": "product",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "product_01",
    "type": "product",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "product_02",
    "type": "product",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.022,
    "missing": []
  },
  {
    "id": "product_03",
    "type": "product",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "product_04",
    "type": "product",
    "format": "md",
    "style": "malformed",
    "score": 0.9,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "report_00",
    "type": "report",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "report_01",
    "type": "report",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "report_02",
    "type": "report",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.017,
    "missing": []
  },
  {
    "id": "report_03",
    "type": "report",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "report_04",
    "type": "report",
    "format": "txt",
    "style": "malformed",
    "score": 0.8,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "resume_00",
    "type": "resume",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "resume_01",
    "type": "resume",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "resume_02",
    "type": "resume",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.033,
    "missing": []
  },
  {
    "id": "resume_03",
    "type": "resume",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "resume_04",
    "type": "resume",
    "format": "txt",
    "style": "malformed",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "travel_00",
    "type": "travel",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "travel_01",
    "type": "travel",
    "format": "txt",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "travel_02",
    "type": "travel",
    "format": "docx",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.018,
    "missing": []
  },
  {
    "id": "travel_03",
    "type": "travel",
    "format": "md",
    "style": "structured",
    "score": 1.0,
    "elapsed": 0.001,
    "missing": []
  },
  {
    "id": "travel_04",
    "type": "travel",
    "format": "docx",
    "style": "malformed",
    "score": 1.0,
    "elapsed": 0.016,
    "missing": []
  }
];
