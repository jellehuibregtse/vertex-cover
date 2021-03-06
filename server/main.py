import json

from graph import Graph
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

from tree import Tree
from weighted_graph import WeightedGraph

app = FastAPI(
    title="Vertex cover",
    description="An implementation of vertex cover visualization with kernelization, pruning, search tree "
                "optimization and brute force.",
    version="1.0.0"
)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['POST', 'PUT'], allow_headers=["*"])


class GenerateItem(BaseModel):
    vertices: int
    probability: float


@app.post("/generate")
def generate(item: GenerateItem):
    graph = Graph()
    graph.generate_graph(item.vertices, item.probability)
    return graph.graph


@app.post("/generate-weighted")
def generate_weighted(item: GenerateItem):
    weighted = WeightedGraph()
    weighted.generate_graph(item.vertices, item.probability)
    return weighted.graph.graph


class GenerateTreeItem(BaseModel):
    nodes: int
    max_children: int


@app.post("/generate-tree")
def generate_tree(item: GenerateTreeItem):
    tree = Tree()
    tree.create_tree(item.nodes, item.max_children)
    return tree.graph.graph


class UpdateItem(BaseModel):
    graph: Any


@app.put("/get-matrix")
def get_matrix(g: UpdateItem):
    return json.dumps(Graph(g.graph).to_adj_matrix())


@app.put("/connect-sub")
def connect_sub(g: UpdateItem):
    graph = Graph(g.graph)
    graph.connect_two_sub_graphs()
    return graph.graph


@app.put("/connect-all-sub")
def connect_all_sub(g: UpdateItem):
    graph = Graph(g.graph)
    graph.connect_all_sub_graphs()
    return graph.graph


@app.put("/connect-random")
def connect_random(g: UpdateItem):
    graph = Graph(g.graph)
    graph.connect_two_random_vertices()
    return graph.graph


class CoverItem(BaseModel):
    graph: Any
    depth: int
    k: int


@app.post("/tree-cover")
def tree_cover(c: CoverItem):
    graph = Graph(c.graph)
    return graph.tree_approximation()


@app.post("/vertex-cover")
def vertex_cover(c: CoverItem):
    graph = Graph(c.graph)
    return graph.vertex_cover_brute(c.k, c.depth)[0]


@app.post("/vertex-cover-kernelized")
def vertex_cover(c: CoverItem):
    graph = Graph(c.graph)
    reduction = graph.kernelization(c.k)
    reduction_graph = Graph(reduction[0])
    return reduction_graph.vertex_cover_brute(c.k, c.depth, best=reduction[1])[0]


@app.post("/vertex-cover-approximation")
def vertex_cover(c: CoverItem):
    graph = Graph(c.graph)
    return graph.approximation()


@app.put("/increase-pendants")
def increase_pendants(g: UpdateItem):
    graph = Graph(g.graph)
    graph.increase_pendant_vertices()
    return graph.graph


@app.put("/decrease-pendants")
def decrease_pendants(g: UpdateItem):
    graph = Graph(g.graph)
    graph.decrease_pendant_vertices()
    return graph.graph


class TopsItem(BaseModel):
    graph: Any
    k: int


@app.put("/increase-tops")
def increase_tops(g: TopsItem):
    graph = Graph(g.graph)
    graph.increase_tops_vertices(g.k)
    return graph.graph


@app.put("/decrease-tops")
def decrease_tops(g: TopsItem):
    graph = Graph(g.graph)
    graph.decrease_tops_vertices(g.k)
    return graph.graph


@app.put("/increase-isolated")
def increase_isolated(g: UpdateItem):
    graph = Graph(g.graph)
    graph.increase_isolated_vertices()
    return graph.graph


@app.put("/decrease-isolated")
def decrease_isolated(g: UpdateItem):
    graph = Graph(g.graph)
    graph.decrease_isolated_vertices()
    return graph.graph


@app.post("/kernelization")
def kernelization(g: TopsItem):
    graph = Graph(g.graph)
    return graph.visualize_kernelization(g.k)


class GraphItem(BaseModel):
    graph: Any


@app.post("/minimum-spanning-tree")
def minimum_spanning_tree(g: GraphItem):
    graph = WeightedGraph(g.graph)
    return graph.kruskal_mst()


@app.post("/eulerian-multigraph")
def eulerian_multigraph(g: GraphItem):
    graph = WeightedGraph(g.graph)
    return graph.eulerian_multigraph()


@app.post("/christofides-algorithm")
def eulerian_multigraph(g: GraphItem):
    graph = WeightedGraph(g.graph)
    return graph.christofides_algorithm()
