import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Job extends Document {
    @Prop() title: string;
    @Prop() company: string;
    @Prop() location: string;
    @Prop() experience: string;
    @Prop() applyLink: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
