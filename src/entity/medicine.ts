import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {medicine_types} from "./medicine_types";
import {intake_moment_medicines} from "./intake_moment_medicines";


@Entity("medicine",{schema:"asautar_db" } )
@Index("fk_Medicine_Medicine_types1_idx",["medicine_type",])
export class medicine {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"name"
        })
    name:string;
        

    @Column("longtext",{
        name:"description"
        })
    description:string;
        

   
    @ManyToOne(type=>medicine_types, medicine_types=>medicine_types.medicines,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'medicine_type'})
    medicine_type:medicine_types | null;


    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"unit"
        })
    unit:string;
        

   
    @OneToMany(type=>intake_moment_medicines, intake_moment_medicines=>intake_moment_medicines.medicine_id,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    intake_moment_medicines:intake_moment_medicines[];
    
}
