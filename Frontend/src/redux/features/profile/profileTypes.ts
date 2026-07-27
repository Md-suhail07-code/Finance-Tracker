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
    maxCategory : {
        name: string,
        amount: number
    },
    maxSpendMonth : {
        month: string,
        amount: number
    }
}