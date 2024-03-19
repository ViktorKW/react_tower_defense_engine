import { IEnemy } from "../store/gameSlice"

export default function getAllMostDangerousEnemies(enemies:IEnemy[]) {
    return enemies.filter((enemyItem) => {
        return enemyItem.distance / enemyItem.speedMS <= 1 
    })
}