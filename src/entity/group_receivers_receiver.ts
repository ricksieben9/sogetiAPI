import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {group} from "./group";
import {user} from "./user";
import {receiver} from "./receiver";
import {priority} from "./priority";


@Entity("group_receivers_receiver",{schema:"asautar_db" } )


export class group_receivers_receiver {

    @ManyToOne(type=>group, group=>group.group_receivers_receiver,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION', eager: true })
    @JoinColumn({ name:'groupId'})
    groupId:number | null;


    @OneToOne(type=>receiver, receiver=>receiver.groups,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION', eager: true })
    @JoinColumn({ name:'receiverId'})
    receiver_id:number | null;

}
