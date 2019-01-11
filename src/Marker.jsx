import React from 'react';
import {Marker} from 'react-google-maps';

const StopMarker = (props) => {
    const {id,pos} = props;

    const onMarkClick = (evt) => {
        console.log(id)
        console.log(pos)
    };

    return(
        <Marker
            onClick={onMarkClick}
            {...props}
        />
    );
};

export default StopMarker;