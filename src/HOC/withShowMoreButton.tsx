import React, { useState } from 'react';

const withShowMoreButton = (OriginalComponent: React.FC, initialValue: number) => {
    let [number_of_visible_items, set_number_of_visible_items] = useState<number>(initialValue)
    
}

export default withShowMoreButton