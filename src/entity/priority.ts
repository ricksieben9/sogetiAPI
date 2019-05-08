import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {timetonotificate} from "./timetonotificate";
import {group_dispensers} from "./group_dispensers";
import {intake_moment} from "./intake_moment";


@Entity("priority",{schema:"asautar_db" } )
@Index("fk_Priority_TimeToNotificate1_idx",["time_to_notificate",])
export class priority {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"number"
        })
    number:number;
        

   
    @ManyToOne(type=>timetonotificate, timetonotificate=>timetonotificate.priority,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'time_to_notificate'})
    time_to_notificate:timetonotificate | null;


   
    @OneToMany(type=>group_dispensers, group_dispensers=>group_dispensers.priority,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    group_dispensers:group_dispensers[];
    

   
    @OneToMany(type=>intake_moment, intake_moment=>intake_moment.priority_number,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    intake_moments:intake_moment[];
    
}
