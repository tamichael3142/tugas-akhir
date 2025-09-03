import constants from '~/constants'
import { SchoolData } from './main-footer-types'
import { FaLocationArrow, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa'
import assets from '~/assets'

const schools: SchoolData[] = [
  {
    name: 'PG - TK',
    address: constants.sbbsTK.address.short,
    phone: constants.sbbsTK.phone,
    whatsApp: constants.sbbsTK.whatsapp,
    mapSrc: constants.sbbsTK.map.embedSrc,
  },
  {
    name: 'SD',
    address: constants.sbbsSD.address.short,
    phone: constants.sbbsSD.phone,
    whatsApp: constants.sbbsSD.whatsapp,
    mapSrc: constants.sbbsSD.map.embedSrc,
  },
  {
    name: 'SMP',
    address: constants.sbbs.address.short,
    phone: constants.sbbs.phone,
    whatsApp: constants.sbbs.whatsapp,
    mapSrc: constants.sbbs.map.embedSrc,
  },
]

const labels = {
  address: 'Address',
  phone: 'Call',
  whatsApp: 'Whatsapp',
  map: 'Our Location',
}

export default function MainFooter() {
  return (
    <footer className='bg-bluish-grey py-10 px-8 w-full'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-10'>
          {schools.map((school, index) => (
            <div key={`footer-school-${index}`} className='flex-1 flex flex-col flex-wrap gap-6'>
              <p className='font-semibold text-xl'>{school.name}</p>
              <div className='flex flex-row gap-3'>
                <FaMapMarkerAlt className='text-2xl text-primary' />
                <div>
                  <p className='font-semibold'>{labels.address}</p>
                  <p className='text-sm'>{school.address}</p>
                </div>
              </div>
              <div className='flex flex-row gap-3'>
                <FaPhone className='text-2xl text-primary' />
                <div>
                  <p className='font-semibold'>{labels.phone}</p>
                  <p className='text-sm'>{school.phone}</p>
                </div>
              </div>
              <div className='flex flex-row gap-3'>
                <FaWhatsapp className='text-2xl text-primary' />
                <div>
                  <p className='font-semibold'>{labels.whatsApp}</p>
                  <p className='text-sm'>{school.whatsApp}</p>
                </div>
              </div>
              <div className='flex flex-row gap-3'>
                <FaLocationArrow className='text-2xl text-primary' />
                <div>
                  <p className='font-semibold'>{labels.map}</p>
                </div>
              </div>
              <iframe
                src={school.mapSrc}
                title={school.address}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='aspect-square'
              ></iframe>
            </div>
          ))}
        </div>
        <div className='border-b border-font-main my-12' />
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1'>
            <img src={assets.images.logoFooter()} alt={assets.images.logoFooter()} className='w-full h-auto' />
          </div>
          <div className='flex-1'>
            <p className='text-center md:text-left'>{constants.sbbs.footer.description}</p>
          </div>
          <div className='flex-1'>
            <p className='text-center md:text-end whitespace-pre-wrap'>
              {constants.sbbs.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
