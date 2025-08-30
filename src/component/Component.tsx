import React from "react"

interface ComponentProps {
    color?: string
}

const Component: React.FunctionComponent<ComponentProps> = ({
    color
}) => {
    return <div style={{ color: color }}>
        asdf
    </div>
}

export default Component;