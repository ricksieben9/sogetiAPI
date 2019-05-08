import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {group_dispensers} from "./group_dispensers";
import {receiver} from "./receiver";


@Entity("group",{schema:"asautar_db" } )
export class group {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"name"
        })
    name:string;
        

   
    @OneToMany(type=>group_dispensers, group_dispensers=>group_dispensers.groups_id,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    group_dispensers:group_dispensers[];
    

   
    @ManyToMany(type=>receiver, receiver=>receiver.groups,{  nullable:false, })
    @JoinTable({ name:'group_receiver'})
    receivers:receiver[];
    
}
