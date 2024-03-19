import { IEnemy } from "../store/gameSlice"

export default function getEnemiesWithinRange(enemies:IEnemy[], towerRange:number) {
    return enemies.filter((enemyItem) => {
        return enemyItem.distance <= towerRange
    })
}