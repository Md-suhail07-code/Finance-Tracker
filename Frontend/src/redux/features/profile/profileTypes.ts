export interface ProfileState{
    user : {
        id: string,
        name: string,
        email: string
    },
    totalTransactions: number,
    totalIncome : number,
    totalExpense : number,
    totalSaved : number,
    avgExpense : number,
    maxCategory : string,
    maxSpendMonth : string
}