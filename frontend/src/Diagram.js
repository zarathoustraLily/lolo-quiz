import React from 'react';
import createEngine, { 
  DefaultNodeModel, 
  DiagramModel 
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

const Diagram = () => {
  // Créer un moteur de diagramme
  const engine = createEngine();

  // Créer un modèle de diagramme
  const model = new DiagramModel();

  // Créer un nœud
  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });
  node1.setPosition(100, 100);
  const port1 = node1.addOutPort('Out');

  // Créer un autre nœud
  const node2 = new DefaultNodeModel({
    name: 'Node 2',
    color: 'rgb(192,255,0)',
  });
  node2.setPosition(400, 100);
  const port2 = node2.addInPort('In');

  // Lier les nœuds
  const link = port1.link(port2);
  link.addLabel('Hello World!');

  // Ajouter les nœuds et le lien au modèle
  model.addAll(node1, node2, link);

  // Charger le modèle dans le moteur
  engine.setModel(model);

  return (
    <div style={{ height: '500px' }}>
      <CanvasWidget engine={engine} />
    </div>
  );
};

export default Diagram;