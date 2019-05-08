import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {group} from "./group";
import {user} from "./user";
import {priority} from "./priority";


@Entity("group_dispensers",{schema:"asautar_db" } )
@Index("fk_Groups_has_Caregiver_Groups1_idx",["groups_id",])
@Index("fk_Group_Caregivers_User1_idx",["user_id",])
@Index("fk_Group_dispensers_Priority1_idx",["priority",])
export class group_dispensers {

   
    @ManyToOne(type=>group, group=>group.group_dispensers,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'groups_id'})
    groups_id:group | null;


   
    @ManyToOne(type=>user, user=>user.group_dispensers,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'user_id'})
    user_id:user | null;


   
    @ManyToOne(type=>priority, priority=>priority.group_dispensers,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'priority'})
    priority:priority | null;

}
