import React, {useState, useEffect} from 'react'

export default ({show, children}) => {
    const [shouldRender, setRender] = useState(show)

    useEffect(() => {
        // show is props passed to determine whether to show the component or not
        if(show){
            setRender(true)
        }
    }, [show])

    const onAnimationEnd = () => {
        // triggers when the animation ends. Only when it's supposed to not show
        if(!show){
            //only when the show is false will we actually change state to close the element
            // this ultimately will trigger the app to close
            // the animation will trigger the effect.
            setRender(false)
        }
    }

    // cloning the react child(ren) to add the custom function and style
    const renderNewComponent = React.Children.map(children,child => {
        // second arg of clone element gets added to props object
        return React.cloneElement(child, { 
            style: {
                animation: `${!!show ? "reactionContainerFadeIn" : "reactionContainerFadeOut"} 0.3s`,
            },
            onAnimationEnd
        })
    })

    // console.log(renderNewComponent)
    return (
        shouldRender && renderNewComponent
        // <div 
        //     onClick={handleUnblur}
        //     style={{
        //         animation: `${!!show ? "reactionContainerFadeIn" : "reactionContainerFadeOut"} 0.3s`,
        //     }}
        //     onAnimationEnd={onAnimationEnd} 
        //     className={`blur`}>
        // </div>
    )
} 