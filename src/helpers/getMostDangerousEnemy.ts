import { IEnemy } from "../store/gameSlice"

export default function getMostDangerousEnemy(enemies:IEnemy[]): IEnemy | null {
    if(!enemies.length) {
        return null
    }

    return enemies.reduce((prev, current) => {
        return ((prev.distance / prev.speedMS) < (current.distance / current.speedMS)) ? prev : current
    })
}