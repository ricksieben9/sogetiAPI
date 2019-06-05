import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {intake_moment} from "./intake_moment";
import {medicine} from "./medicine";


@Entity("intake_moment_medicines",{schema:"asautar_db" } )
@Index("fk_Intake_moment_has_Medicine_Medicine1_idx",["medicine_id",])
export class intake_moment_medicines {

   
    @ManyToOne(type=>intake_moment, intake_moment=>intake_moment.intake_moment_medicines,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION', eager: true})
    @JoinColumn({ name:'intake_moment_id'})
    intake_moment_id:intake_moment | null;


   
    @ManyToOne(type=>medicine, medicine=>medicine.intake_moment_medicines,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION', eager: true })
    @JoinColumn({ name:'medicine_id'})
    medicine_id:medicine | null;


    @Column("int",{ 
        nullable:false,
        name:"time_window"
        })
    time_window:number;
        

    @Column("datetime",{ 
        nullable:true,
        name:"completed at"
        })
    completed_at:Date | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"dosage"
        })
    dosage:string;
        
}
