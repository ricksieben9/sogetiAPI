import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {roles} from "./roles";
import {group_dispensers} from "./group_dispensers";
import {intake_moment} from "./intake_moment";
import {log} from "./log";
import * as bcrypt from "bcryptjs";



@Entity("user",{schema:"asautar_db" } )
@Index("email_UNIQUE",["email",],{unique:true})
@Index("name_UNIQUE",["name",],{unique:true})
@Index("fk_Person_Roles_idx",["roles_role",])
export class user {


    @ManyToOne(type=>roles, roles=>roles.users,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION', eager: true })

    @JoinColumn({ name:'roles_role'})
    roles_role:roles | null;


    @PrimaryGeneratedColumn({
        type:"int",
        name:"id"
        })
    id:number;


    @Column("varchar",{
        nullable:false,
        unique: true,
        length:100,
        name:"email"
        })
    email:string;


    @Column("varchar",{
        nullable:false,
        length:100,
        name:"password"
        })
    password:string;


    @Column("varchar",{
        nullable:false,
        unique: true,
        length:45,
        name:"name"
        })
    name:string;

    @Column("tinyint",{
        nullable:false,
        width:1,
        default: () => "'0'",
        name:"isfirst"
    })
    isfirst:boolean;

    @OneToMany(type=>group_dispensers, group_dispensers=>group_dispensers.user_id,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    group_dispensers:group_dispensers[];



    @OneToMany(type=>intake_moment, intake_moment=>intake_moment.dispenser,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    intake_moments:intake_moment[];



    @OneToMany(type=>log, log=>log.user_id,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    logs:log[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
