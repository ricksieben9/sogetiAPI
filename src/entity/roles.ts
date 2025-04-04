import {Column, Entity, OneToMany} from "typeorm";
import {user} from "./user";


@Entity("roles",{schema:"asautar_db" } )
export class roles {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:25,
        name:"role"
        })
    role:string;
        

   
    @OneToMany(type=>user, user=>user.roles_role,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    users:user[];
    
}
