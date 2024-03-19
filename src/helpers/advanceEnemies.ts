import { IEnemy } from "../store/gameSlice"

export default function advanceEnemies(enemies:IEnemy[]) {
    return enemies.map(enemyItem => {
        const newDistance = Math.floor(enemyItem.distance - enemyItem.speedMS) || 0

        return {
            ...enemyItem,
            distance: newDistance
        }
    })
}