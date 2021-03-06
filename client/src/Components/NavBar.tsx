import React from 'react';
import { Alignment, Button, Menu, MenuItem, Navbar, Popover } from '@blueprintjs/core';
import { PromiseWithCancel } from '../Interfaces/PromiseWithCancel';

export function NavBar(props: {
    data: Record<string, unknown>;
    doFetch: (
        path: string,
        method: string,
        body: any,
        resolve?: ((res: any) => void) | undefined,
        name?: string | undefined
    ) => PromiseWithCancel<any> | undefined;
}): JSX.Element {
    const getAdjMatrix = () => {
        props.doFetch(
            '/get-matrix',
            'PUT',
            {
                graph: props.data
            },
            (res) => {
                navigator.clipboard.writeText(res.data.toString());
            },
            'Get adjacency matrix'
        );
    };

    const redirectToAPI = () => {
        window.location.href = process.env.REACT_APP_SERVER_URL + '/docs';
    };

    const menu = (
        <Menu>
            <MenuItem icon="code" text="API Documentation" onClick={redirectToAPI} />
            <MenuItem icon="graph" text="Copy adjacency matrix to clipboard" onClick={getAdjMatrix} />
        </Menu>
    );

    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>Vertex Cover</Navbar.Heading>
                <Navbar.Divider />
                <Navbar.Heading style={{ marginLeft: '1em' }}>by Jelle Huibregtse & Aron Hemmes</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Popover content={menu}>
                    <Button className="bp3-minimal" icon="cog" />
                </Popover>
            </Navbar.Group>
        </Navbar>
    );
}
