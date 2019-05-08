import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {log_category} from "./log_category";
import {user} from "./user";


@Entity("log",{schema:"asautar_db" } )
@Index("fk_Log_Log_category1_idx",["category",])
@Index("fk_Log_User1_idx",["user_id",])
export class log {

    @PrimaryGeneratedColumn({
        type:"int",
        name:"id"
    })
    id:number;


    @Column("longtext",{
        nullable:false,
        name:"message"
    })
    message:string;

    @Column("datetime",{
        nullable:true,
        name:"datetime"
    })
    datetime:Date | null;

    @Column("varchar",{
        nullable:false,
        name:"category"
    })
    category:string;

    @Column("int",{
        nullable:false,
        name:"user_id"
    })
    user_id:number;

    @Column("int",{
        nullable: true,
        name:"intake_moment_id"
    })
    intake_moment_id:number;

    // @ManyToOne(type=>log_category, log_category=>log_category.logs,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    // @JoinColumn({ name:'category'})
    // category:log_category | null;
    //
    //
    //
    // @ManyToOne(type=>user, user=>user.logs,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    // @JoinColumn({ name:'user_id'})
    // user_id:user | null;
}
