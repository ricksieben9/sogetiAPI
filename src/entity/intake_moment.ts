import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {receiver} from "./receiver";
import {priority} from "./priority";
import {user} from "./user";
import {intake_moment_medicines} from "./intake_moment_medicines";


@Entity("intake_moment",{schema:"asautar_db" } )
@Index("fk_intake_moment_Receiver1_idx",["receiver_id",])
@Index("fk_Intake_moment_Priority1_idx",["priority_number",])
@Index("fk_Intake_moment_User1_idx",["dispenser",])
export class intake_moment {

    @PrimaryGeneratedColumn({
        type:"int",
        name:"id"
        })
    id:number;


    @Column("datetime",{
        nullable:false,
        name:"intake_start_time"
        })
    intake_start_time:Date;

    @Column("datetime",{
        name:"intake_end_time"
        })
    intake_end_time:Date | null;
        

    @ManyToOne(type=>receiver, receiver=>receiver.intake_moments,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'receiver_id'})
    receiver_id:receiver | null;


    @Column("longtext",{
        nullable:true,
        name:"remark"
        })
    remark:string | null;


    @ManyToOne(type=>priority, priority=>priority.intake_moments,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'priority_number'})
    priority_number:priority | null;


    @ManyToOne(type=>user, user=>user.intake_moments,{  onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'dispenser'})
    dispenser:user | null;


    @OneToMany(type=>intake_moment_medicines, intake_moment_medicines=>intake_moment_medicines.intake_moment_id,{  cascade: true })
    intake_moment_medicines:intake_moment_medicines[];

}
