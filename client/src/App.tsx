import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from './Util/useWindowDimensions';
import { convertToD3Graph } from './Util/convertToD3Graph';
import './App.css';
import { Graph } from 'react-d3-graph';
import { FocusStyleManager } from '@blueprintjs/core';
import { MainPage } from './Components/MainPage';

FocusStyleManager.onlyShowFocusOnTabs();

export function App(): JSX.Element {
    const graphBoundingRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph<any, any>>(null);
    const { width, height } = useWindowDimensions();
    const [data, setData] = useState<any>({});
    const [cover, setCover] = useState<{ depth: number; vertices: number[] }>({ depth: 1, vertices: [] });
    const [kernel, setKernel] = useState<{ isolated: number[]; pendant: number[]; tops: number[] }>({
        isolated: [],
        pendant: [],
        tops: []
    });
    const [edges, setEdges] = useState<number[][]>([]);
    const [tour, setTour] = useState<number[]>([]);
    const [maxChildren, setMaxChildren] = useState<number>(2);
    const [isTree, setIsTree] = useState<boolean>(false);

    const arrangeTree = useCallback(() => {
        if (
            isTree &&
            graphRef.current != null &&
            graphRef.current.state.nodes[0] !== undefined &&
            graphBoundingRef.current != null
        ) {
            let highestY = 0;
            Object.keys(graphRef.current.state.nodes).forEach((node) => {
                if (graphRef.current != null) {
                    const y = graphRef.current.state.nodes[node].y;

                    if (y > highestY) {
                        highestY = y;
                    }
                }
            });

            Object.keys(graphRef.current.state.nodes).forEach((node: any) => {
                if (graphRef.current != null && graphBoundingRef.current != null) {
                    graphRef.current.state.nodes[node].y =
                        highestY + 250 * maxChildren * Math.ceil(graphRef.current.state.nodes[node].id / maxChildren);
                }
            });
        }
    }, [isTree, maxChildren]);

    useEffect(() => {
        centerNodes();
        if (isTree) {
            arrangeTree();
        }
    }, [width, height, data, setData, arrangeTree, isTree]);

    useEffect(() => {
        if (kernel.isolated.length > 0 || kernel.pendant.length > 0 || kernel.tops.length > 0) {
            setCover({ depth: cover.depth, vertices: [] });
            setEdges([]);
            setTour([]);
        }
    }, [cover.depth, kernel]);

    useEffect(() => {
        if (cover.vertices.length > 0) {
            setKernel({ isolated: [], pendant: [], tops: [] });
            setEdges([]);
            setTour([]);
        }
    }, [cover]);

    useEffect(() => {
        if (edges.length > 0) {
            setKernel({ isolated: [], pendant: [], tops: [] });
            setCover({ depth: cover.depth, vertices: [] });
            setTour([]);
        }
    }, [cover.depth, edges]);

    useEffect(() => {
        if (tour.length > 0) {
            setKernel({ isolated: [], pendant: [], tops: [] });
            setCover({ depth: cover.depth, vertices: [] });
            setEdges([]);
        }
    }, [cover.depth, tour]);

    useEffect(() => {
        setData({ '0': [1], '1': [0] });
    }, []);

    const onClickNode = function (nodeId: string) {
        if (kernel.isolated.length == 0 && kernel.pendant.length == 0 && kernel.tops.length == 0) {
            // const e = Array.isArray(edge) ? edge[0] : edge;

            const c = Object.assign([], cover.vertices);
            if (c.indexOf(+nodeId, 0) > -1) c.splice(cover.vertices.indexOf(+nodeId, 0), 1);
            else c.push(+nodeId);
            setCover({ depth: cover.depth, vertices: c });
        }
    };

    function centerNodes() {
        if (
            graphRef.current != null &&
            graphRef.current.state.nodes[0] !== undefined &&
            graphBoundingRef.current != null
        ) {
            const nodeCount = Object.keys(graphRef.current.state.nodes).length;
            let sumX = 0;
            let sumY = 0;
            let highestY = 0;
            const boundingBox = graphBoundingRef.current.getBoundingClientRect();
            Object.keys(graphRef.current.state.nodes).forEach((node) => {
                if (graphRef.current != null) {
                    const y = graphRef.current.state.nodes[node].y;

                    sumX += graphRef.current.state.nodes[node].x;
                    sumY += y;

                    if (y > highestY) {
                        highestY = y;
                    }
                }
            });
            Object.keys(graphRef.current.state.nodes).forEach((node: any) => {
                if (graphRef.current != null && graphBoundingRef.current != null) {
                    graphRef.current.state.nodes[node].x += boundingBox.width / 2 - sumX / nodeCount;
                    graphRef.current.state.nodes[node].y += boundingBox.height / 2 - sumY / nodeCount;
                }
            });
        }
    }

    return (
        <MainPage
            graphBoundingRef={graphBoundingRef}
            graphRef={graphRef}
            data={data}
            setData={setData}
            cover={cover}
            setCover={setCover}
            kernel={kernel}
            setKernel={setKernel}
            setEdges={setEdges}
            setTour={setTour}
            maxChildren={maxChildren}
            setMaxChildren={setMaxChildren}
            isTree={isTree}
            setIsTree={setIsTree}
        >
            <div className="container__graph-area" ref={graphBoundingRef}>
                <Graph
                    id="graph-id"
                    ref={graphRef}
                    data={convertToD3Graph(data, cover, kernel, tour, edges)}
                    onClickNode={onClickNode}
                    config={{
                        directed: tour.length > 0,
                        staticGraph: false,
                        staticGraphWithDragAndDrop: tour.length > 0,
                        height: graphBoundingRef.current != null ? graphBoundingRef.current.offsetHeight : 0,
                        width: graphBoundingRef.current != null ? graphBoundingRef.current.offsetWidth : 0,
                        minZoom: 0.5,
                        maxZoom: 8,
                        link: {
                            labelProperty: 'text',
                            renderLabel: true
                        }
                    }}
                />
            </div>
        </MainPage>
    );
}
