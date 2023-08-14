import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

export class PostEntity implements Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  authorId: number;
}
// id        Int      @default(autoincrement()) @id
// title     String
// content   String?
// published Boolean? @default(false)
// author    User?    @relation(fields: [authorId], references: [id])
// authorId  Int?
