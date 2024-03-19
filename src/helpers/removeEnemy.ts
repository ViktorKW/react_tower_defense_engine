import { IEnemy } from "../store/gameSlice"

export default function removeEnemy(enemies:IEnemy[], id:string) {
    return enemies.filter(enemyItem => {
        return  enemyItem.id !== id
    })
}