import {Column, Entity, OneToMany} from "typeorm";
import {log} from "./log";


@Entity("log_category",{schema:"asautar_db" } )
export class log_category {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:45,
        name:"name"
        })
    name:string;
        

   
    @OneToMany(type=>log, log=>log.category,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    logs:log[];
    
}
