// model Todo {
//     id        Int      @id @default(autoincrement())
//     text      String
//     order     Int
//     completed Boolean  @default(false)
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     userId    Int
//     user      User     @relation(fields: [userId], references: [id])
  
//     @@index([userId])
//   }

export type Todo = {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    userId: number;
    };
    