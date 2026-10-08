import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { MOVEMENT_TYPES } from '../../../utils/constants';

const MovementsTab = ({ movements }) => {
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMovements = typeFilter === 'all' 
    ? movements 
    : movements.filter(movement => movement.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mouvements de BigBags</h2>
          <p className="text-gray-600">Historique des entrées et sorties</p>
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {MOVEMENT_TYPES.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date/Heure</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Camion</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Chauffeur</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Partenaire</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">BigBags</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Caméra</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {new Date(movement.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'entrée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type === 'entrée' ? 'Entrée' : 'Sortie'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.camion}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.chauffeur}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {movement.type === 'entrée' ? movement.fournisseur : movement.client}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.bigbags}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.camera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementsTab;