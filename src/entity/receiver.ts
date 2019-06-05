import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {intake_moment} from "./intake_moment";
import {group} from "./group";


@Entity("receiver",{schema:"asautar_db" } )
export class receiver {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"name"
        })
    name:string;
        

   
    @OneToMany(type=>intake_moment, intake_moment=>intake_moment.receiver_id,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    intake_moments:intake_moment[];
    

    @ManyToMany(type=>group, group=>group.receivers)
    groups:group[];
    
}
