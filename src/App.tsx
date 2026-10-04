import { useEffect, useRef, useState, useMemo } from 'react'
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Stars,
} from 'lucide-react'

import { invitation } from './config'
import coverVideo from './assets/cover.mp4'

type Screen = 'cover' | 'invitation'

function Countdown() {
  const target = useMemo(
    () => new Date(invitation.event.date).getTime(),
    []
  )

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const difference = Math.max(0, target - now)

  const days = Math.floor(difference / 86400000)
  const hours = Math.floor((difference / 3600000) % 24)
  const minutes = Math.floor((difference / 60000) % 60)
  const seconds = Math.floor((difference / 1000) % 60)

  return (
    <div className="countdown" aria-label="Cuenta regresiva">
      <div>
        <strong>{days}</strong>
        <span>días</span>
      </div>

      <div>
        <strong>{hours}</strong>
        <span>hrs</span>
      </div>

      <div>
        <strong>{minutes}</strong>
        <span>min</span>
      </div>

      <div>
        <strong>{seconds}</strong>
        <span>seg</span>
      </div>
    </div>
  )
}

function WhatsAppButton({
  person,
  number,
}: {
  person: string
  number: string
}) {
  const message = encodeURIComponent(
    `¡Hola! ✨ Quiero confirmar mi asistencia al bautizo. ¡Ahí estaremos! 💕`
  )

  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={20} />
      Confirmar con {person}
    </a>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('cover')

  /*
   * null    = todavía no ha elegido
   * nino    = Team Niño
   * nina    = Team Niña
   */

  /*
   * Indica si la sección Team está bloqueando el scroll.
   */
  const [teamLocked, setTeamLocked] = useState(false)

  const storyRef = useRef<HTMLElement>(null)
  const teamSectionRef = useRef<HTMLElement>(null)

  /*
   * Guarda la posición donde quedó bloqueado el documento.
   */
  const lockedScrollY = useRef(0)

  /*
   * ============================================================
   * DETECTAR CUANDO EL USUARIO LLEGA A LA SECCIÓN TEAM
   * ============================================================
   *
   * El usuario puede hacer scroll normalmente desde el Hero.
   *
   * Cuando llega a la sección Team, congelamos el documento.
   */
  useEffect(() => {
    if (screen !== 'invitation') return

    const handleScroll = () => {
      const section = teamSectionRef.current

      if (!section) return

      const sectionTop = section.offsetTop
      const currentScrollY = window.scrollY

      /*
       * Llegamos a la sección Team.
       */
      if (!teamLocked && currentScrollY >= sectionTop) {
        lockedScrollY.current = sectionTop

        /*
         * Activamos el estado de bloqueo.
         */
        setTeamLocked(true)

        /*
         * Fijamos el body exactamente en la posición
         * donde está la sección Team.
         */
        document.body.style.position = 'fixed'
        document.body.style.top = `-${sectionTop}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'

        document.documentElement.style.overflow = 'hidden'
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [screen, teamLocked])

  /*
   * ============================================================
   * BLOQUEAR WHEEL / TOUCH / TECLADO
   * ============================================================
   *
   * Esto es especialmente importante para celulares.
   */
  useEffect(() => {
    if (!teamLocked) return

    const preventScroll = (event: WheelEvent | TouchEvent) => {
      event.preventDefault()
    }

    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const blockedKeys = [
        'ArrowDown',
        'ArrowUp',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
      ]

      if (blockedKeys.includes(event.key)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, {
      passive: false,
    })

    window.addEventListener('touchmove', preventScroll, {
      passive: false,
    })

    window.addEventListener('keydown', preventKeyboardScroll)

    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventKeyboardScroll)
    }
  }, [teamLocked])

  /*
   * ============================================================
   * LIMPIAR EL BLOQUEO
   * ============================================================
   */
  useEffect(() => {
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.overflow = ''

      document.documentElement.style.overflow = ''
    }
  }, [])

  /*
   * ============================================================
   * CONTINUAR DESPUÉS DE SELECCIONAR
   * ============================================================
   */

  /*
   * ============================================================
   * COVER
   * ============================================================
   */
  if (screen === 'cover') {
    return (
      <main className="cover">
        <video
          className="cover-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={coverVideo} type="video/mp4" />
        </video>

        <div className="cover-video-overlay" />

        <button
          className="cover-open-button"
          onClick={() => setScreen('invitation')}
        >
          Abrir invitación
          <ChevronRight size={20} />
        </button>
      </main>
    )
  }

  /*
   * ============================================================
   * INVITACIÓN
   * ============================================================
   */
  return (
    <main className="page">

      {/* ======================================================
          STORY
      ====================================================== */}

      <section
        ref={storyRef}
        className="section story"
      >
        <h2>
          Dios me ha regalado una hermosa familia y hoy quiero dar un paso muy especial en mi vida.
        </h2>

        <p>
          Mis papás y yo queremos invitarte a acompañarnos en mi Bautizo y compartir juntos este día
          lleno de amor y bendiciones.
        </p>

        <div className="heart-line">
          <span />
          ♡
          <span />
        </div>

        <p className="signature">
          {invitation.message.footer}
        </p>
      </section>


      {/* ======================================================
          DETAILS
      ====================================================== */}

      <section className="section details">

        <span className="section-kicker">
          Un momento muy especial
        </span>

        <h2>
          Guarda la fecha
        </h2>


        <div className="date-card">
          <CalendarDays size={28} />

          <div>
            <strong>
              {invitation.event.dateLabel}
            </strong>
          </div>
        </div>


        <div className="detail-row">

          <div className="detail-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <small>
              Misa
            </small>

            <strong>
              {invitation.event.timeLabelMisa}
            </strong>
          </div>

        </div>


        <div className="detail-row">

          <div className="detail-icon">
            <MapPin size={21} />
          </div>

          <div>
            <small>
              El lugar de la misa
            </small>

            <strong>
              {invitation.event.addressMisa}
            </strong>

            <span>
              {invitation.event.addressMisaDetail}
            </span>
          </div>

        </div>


        <a
          className="map-button"
          href={invitation.event.mapsUrlMisa}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={18} />
          Ver ubicación
        </a>

        <div className="detail-row">

          <div className="detail-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <small>
              Comida
            </small>

            <strong>
              {invitation.event.timeLabel}
            </strong>
          </div>

        </div>


        <div className="detail-row">

          <div className="detail-icon">
            <MapPin size={21} />
          </div>

          <div>
            <small>
              El lugar de la comida
            </small>

            <strong>
              {invitation.event.address}
            </strong>

            <span>
              {invitation.event.addressDetail}
            </span>
          </div>

        </div>


        <a
          className="map-button"
          href={invitation.event.mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={18} />
          Ver ubicación
        </a>

      </section>

      {/* ======================================================
    DRESS CODE
====================================================== */}

      <section className="section dress-code dress-code-nina">

        <span className="section-kicker">
          Si deseas hacerme un regalito...
        </span>

        <h2>
          Algunas ideas 💕
        </h2>

        <div className="gift-text-options">

          <div className="gift-text-option">
            <strong>
              💵 Sobre
            </strong>

            <p>
              Un sobre con mucho cariño para ayudar
              <br />
              en esta nueva aventura.
            </p>
          </div>

          <div className="gift-text-option">
            <strong>
              👗 Ropita
            </strong>

            <p>
              Ropa para bebé en talla <strong>24 meses</strong>.
              <br />
              <span>No zapatos, por favor.</span>
            </p>
          </div>

        </div>

      </section>


      {/* ======================================================
          COUNTDOWN
      ====================================================== */}

      <section className="section countdown-section">

        <Stars className="section-icon" />

        <span className="section-kicker">
          La cuenta regresiva comenzó
        </span>

        <h2>
          Faltan...
        </h2>

        <Countdown />

      </section>




      {/* ======================================================
          RSVP
      ====================================================== */}

      <section className="section rsvp">

        <span className="section-kicker">
          Confirma tu asistencia
        </span>

        <h2>
          ¡Queremos celebrar contigo!
        </h2>


        <div className="rsvp-cards">

          {/* =========================
              MAMÁ
          ========================= */}

          <div className="rsvp-card">



            <WhatsAppButton
              person={invitation.parents.mom}
              number={invitation.whatsapp.mom}
            />

          </div>

        </div>

      </section>




    </main>
  )
}

export default App