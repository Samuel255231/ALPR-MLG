import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { fetchCameras } from '@/redux/slices/CameraSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import { Camera, Play } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CameraPlayer from '../camera/CameraPlayer'

const Surveillance: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { cameras, loading, error } = useSelector((state: RootState) => state.cameras)
    useEffect(() => {
        dispatch(fetchCameras())
    }, [dispatch])

    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Surveillance en Temps Réel</h2>
                <p className="text-gray-600">Monitoring des caméras de détection</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cameras.map(camera => (
                    <div key={camera.id} className="overflow-hidden bg-white rounded-lg shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`rounded-md p-3 ${camera.status === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        <Camera className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex-1 w-0 ml-5">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{camera.description}</dt>
                                        <dd className="text-lg font-medium text-gray-900">{camera.zone.nom}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-3 bg-gray-50">
                            <div className="flex items-center justify-between text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${camera.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {camera.status === 'Actif' ? 'Active' : 'Maintenance'}
                                </span>
                                <span className="text-gray-600">0 détections</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Flux vidéo en direct</h3>
                </CardHeader>
                <CardContent>
                    
                    <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                        {cameras.filter((cam) => {
                            return cam.status === 'Actif'
                        }).map(camera => (
                            <CameraPlayer src={`http://localhost:8000/media/cameras/${camera.code}/stream.m3u8`} />
                            // <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                            //     <div className="text-center">
                            //         <Camera className="w-12 h-12 mx-auto text-gray-400" />
                            //         <p className="mt-2 text-sm text-gray-500">{camera.description}</p>
                            //         <button className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            //             <Play className="w-4 h-4 mr-1" />
                            //             Activer
                            //         </button>
                            //     </div>
                            // </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Surveillance