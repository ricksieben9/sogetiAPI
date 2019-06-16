import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";


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

}
