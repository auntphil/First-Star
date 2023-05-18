import { MagnifyingGlass, ThreeCircles } from "react-loader-spinner"
import '../styles/loading.css'

const LoadingThreeCircles = ({s='100', p='15px'}) => {
    return(
        <ThreeCircles
            height={s}
            width={s}
            color="#4fa94d"
            wrapperStyle={{padding: p}}
            wrapperClass="loading-wrapper"
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
            />
    )
}

const LoadingMagnifyingGlass = ({s='80', p='15px'}) => {
    return(
        <MagnifyingGlass
            visible={true}
            height={s}
            width={s}
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{padding: p}}
            wrapperClass="loading-wrapper"
            glassColor = '#c0efff'
            color = '#4fa94d'
            />
    )
}

export {LoadingThreeCircles, LoadingMagnifyingGlass}