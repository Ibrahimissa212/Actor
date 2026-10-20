import { writeFileSync } from "node:fs";
import { defaultContent } from "../lib/content";
const body = JSON.stringify(defaultContent).replaceAll("'", "''"),
  time = new Date().toISOString();
writeFileSync(
  "build/seed.sql",
  `INSERT OR IGNORE INTO documents(id,body,revision,updated_at) VALUES('draft','${body}',1,'${time}');\nINSERT OR IGNORE INTO documents(id,body,revision,updated_at) VALUES('published','${body}',1,'${time}');\nINSERT OR IGNORE INTO versions(id,body,created_at,author) VALUES('initial-import','${body}','${time}','Initial website import');\n`,
);
