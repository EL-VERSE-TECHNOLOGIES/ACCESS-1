import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  details: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
