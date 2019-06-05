import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {medicine} from "./medicine";


@Entity("medicine_types",{schema:"asautar_db" } )
export class medicine_types {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:50,
        name:"type"
        })
    type:string;
        

   
    @OneToMany(type=>medicine, medicine=>medicine.medicine_type,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    medicines:medicine[];
    
}
