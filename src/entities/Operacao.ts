import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("operacoes")
export class Operacao {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    tipo!: "compra" | "venda";

    @Column()
    ativo!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    quantidade!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    preco!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    valorTotal!: number;

    @Column()
    data!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 