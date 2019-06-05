import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {priority} from "./priority";


@Entity("timetonotificate",{schema:"asautar_db" } )
export class timetonotificate {

    @Column("time",{ 
        nullable:false,
        primary:true,
        name:"time"
        })
    time:string;
        

   
    @OneToMany(type=>priority, priority=>priority.time_to_notificate,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    priority:priority[];
    
}
