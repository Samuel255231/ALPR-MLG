import React, { useState } from 'react';
import { Plus, Package, AlertCircle } from 'lucide-react';
import { STATUS_OPTIONS } from '../../../utils/constants';

const InventoryTab = ({ bigBags }) => {
  const [selectedBigBag, setSelectedBigBag] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBigBags = statusFilter === 'all' 
    ? bigBags 
    : bigBags.filter(bigBag => bigBag.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventaire des BigBags</h2>
          <p className="text-gray-600">{filteredBigBags.length} BigBags dans l'inventaire</p>
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter manuellement
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Référence</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contenu</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Emplacement</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dernière détection</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBigBags.map((bigBag) => (
                  <tr key={bigBag.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {bigBag.reference}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{bigBag.content} ({bigBag.weight})</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{bigBag.location}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bigBag.status === 'stock' ? 'bg-green-100 text-green-800' :
                        bigBag.status === 'transport' ? 'bg-blue-100 text-blue-800' :
                        bigBag.status === 'manquant' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bigBag.status === 'stock' ? 'En stock' :
                         bigBag.status === 'transport' ? 'En transport' :
                         bigBag.status === 'manquant' ? 'Manquant' : 'Endommagé'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {new Date(bigBag.lastDetection).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                      <a href="#" className="text-blue-600 hover:text-blue-900">
                        Détails<span className="sr-only">, {bigBag.reference}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredBigBags.length === 0 && (
        <div className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun BigBag trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos filtres ou ajoutez de nouveaux BigBags.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;