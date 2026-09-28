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
import heroVideo from './assets/1.mp4'
import ninaImage from './assets/nina.png'
import ninoImage from './assets/nino.png'
import teamImage from './assets/team.png'
import regaloNinoImage from './assets/regalonino.png'
import regaloNinaImage from './assets/regalonina.png'
import footerImage from './assets/footer.png'

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
    `¡Hola! ✨ Quiero confirmar mi asistencia a la revelación de ${invitation.babyName}. ¡Ahí estaremos! 💕💙`
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
  const [selectedTeam, setSelectedTeam] = useState<
    'nino' | 'nina' | null
  >(null)

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

    // Si ya eligió un equipo, no necesitamos volver a bloquear.
    if (selectedTeam) return

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
  }, [screen, selectedTeam, teamLocked])

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
  const handleContinue = () => {
    /*
     * Seguridad:
     * si no hay selección, no hacemos absolutamente nada.
     */
    if (!selectedTeam) return

    const story = storyRef.current

    if (!story) return

    /*
     * Calculamos dónde está la siguiente sección
     * antes de desbloquear el body.
     */
    const targetPosition = story.offsetTop

    /*
     * Desbloqueamos el documento.
     */
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.overflow = ''

    document.documentElement.style.overflow = ''

    setTeamLocked(false)

    /*
     * Esperamos un frame para que el navegador
     * vuelva a calcular correctamente el layout.
     */
    requestAnimationFrame(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    })
  }

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
          className="primary-button cover-open-button"
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
          HERO
      ====================================================== */}

      <section className="hero section">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </section>


      {/* ======================================================
          TEAM NIÑO / NIÑA
      ====================================================== */}

      <section
        ref={teamSectionRef}
        className="section team-selection"
      >
        <div className="team-selection-content">

          <span className="section-kicker">
            Antes de continuar...
          </span>

          <div className="team-title-image">
            <img
              src={teamImage}
              alt="Team Niño o Team Niña"
            />
          </div>

          {/* ==================================================
              OPCIONES
          ================================================== */}

          <div className="team-options">

            {/* =========================
                TEAM NIÑO
            ========================= */}

            <button
              type="button"
              className={`team-option team-nino ${selectedTeam === 'nino'
                ? 'selected'
                : ''
                }`}
              onClick={() => {
                setSelectedTeam('nino')
              }}
            >
              <div className="team-image-wrapper">
                <img
                  src={ninoImage}
                  alt="Team niño"
                />
              </div>

              <span className="team-option-title">
                Niño
              </span>

              <span className="team-check">
                {selectedTeam === 'nino' ? '✓' : ''}
              </span>
            </button>


            {/* =========================
                TEAM NIÑA
            ========================= */}

            <button
              type="button"
              className={`team-option team-nina ${selectedTeam === 'nina'
                ? 'selected'
                : ''
                }`}
              onClick={() => {
                setSelectedTeam('nina')
              }}
            >
              <div className="team-image-wrapper">
                <img
                  src={ninaImage}
                  alt="Team niña"
                />
              </div>

              <span className="team-option-title">
                Niña
              </span>

              <span className="team-check">
                {selectedTeam === 'nina' ? '✓' : ''}
              </span>
            </button>

          </div>


          {/* ==================================================
              CONTINUAR
          ================================================== */}

          <button
            type="button"
            className={`team-continue ${selectedTeam ? 'enabled' : ''
              }`}
            disabled={!selectedTeam}
            onClick={handleContinue}
          >
            {selectedTeam
              ? 'Continuar ✨'
              : 'Elige un equipo'}
          </button>

        </div>
      </section>


      {/* ======================================================
          STORY
      ====================================================== */}

      <section
        ref={storyRef}
        className="section story"
      >
        <span className="section-kicker">
          Érase una vez
        </span>

        <h2>
          Una historia de <em>amor</em> que cada día crecía un poquito más…
        </h2>

        <p>
          Mis papás están muy felices porque pronto llegaré a sus vidas,
          y nuestra familia está a punto de comenzar una nueva y maravillosa aventura.
        </p>

        <p>
          Aunque todavía no pueden conocerme, ya me esperan con todo su amor e ilusión.
          Hoy quiero compartir con ustedes un momento muy especial de mi pequeña historia,
          en el que juntos descubriremos quién se esconde detrás de esta dulce espera.
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
          La gran aventura
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

            <span>
              {invitation.event.timeLabel}
            </span>
          </div>
        </div>


        <div className="detail-row">

          <div className="detail-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <small>
              Comenzamos
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
              El lugar mágico
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

      <section
        className={`section dress-code ${selectedTeam === 'nino'
          ? 'dress-code-nino'
          : 'dress-code-nina'
          }`}
      >
        <span className="section-kicker">
          Una pista mágica...
        </span>

        <h2>
          ¿Cómo nos vestimos?
        </h2>

        <p className="dress-code-intro">
          Elige tu color y acompáñanos en esta
          <br />
          gran aventura ✨
        </p>

        {/* COLOR DEL VESTIMENTA */}

        <div className="dress-code-color-card">

          <span
            className={`color-circle ${selectedTeam === 'nino'
              ? 'sky-blue'
              : 'pastel-pink'
              }`}
          />

          <div>
            <span>
              Si elegiste
            </span>

            <strong>
              {selectedTeam === 'nino'
                ? 'TEAM NIÑO 💙'
                : 'TEAM NIÑA 💗'}
            </strong>

            <p>
              Te invitamos a vestir de{' '}
              {selectedTeam === 'nino'
                ? 'azul cielo'
                : 'rosa pastel'}
            </p>
          </div>

        </div>


        {/* REGALOS */}

        <div className="gift-section">

          <span className="section-kicker">
            Si deseas hacernos un regalito...
          </span>

          <h3>
            Hay unas cositas que nos ayudarán mucho 💕
          </h3>

          <div className="gift-image-wrapper">

            <img
              src={
                selectedTeam === 'nino'
                  ? regaloNinoImage
                  : regaloNinaImage
              }
              alt={
                selectedTeam === 'nino'
                  ? 'Pañales y toallas para bebé'
                  : 'Pañales y toallas para bebé'
              }
            />

          </div>

          {selectedTeam === 'nino' && (
            <div className="diaper-note">
              <strong>
                🍼 Pañales
              </strong>

              <p>
                De preferencia en <strong>etapa 1 y etapa 2</strong>.
              </p>
            </div>
          )}

        </div>


        {/* BLANCO RESERVADO */}

        <div className="white-reserved">

          <span className="white-color-circle" />

          <p>
            <strong>Importante:</strong>
            <br />
            El color blanco está reservado exclusivamente
            <br />
            para los papás 🤍
          </p>

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

        <p>
          para descubrir el gran secreto ✨
        </p>

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

        <p>
          Elige con quién quieres confirmar tu asistencia
          y se abrirá WhatsApp con un mensaje listo para
          enviar.
        </p>


        <div className="rsvp-cards">

          {/* =========================
              MAMÁ
          ========================= */}

          <div className="rsvp-card">

            <div className="avatar avatar-mom">
              ♡
            </div>

            <div>
              <strong>
                {invitation.parents.mom}
              </strong>

              <span>
                Confirmar por WhatsApp
              </span>
            </div>

            <WhatsAppButton
              person={invitation.parents.mom}
              number={invitation.whatsapp.mom}
            />

          </div>


          {/* =========================
              PAPÁ
          ========================= */}

          <div className="rsvp-card">

            <div className="avatar avatar-dad">
              ★
            </div>

            <div>
              <strong>
                {invitation.parents.dad}
              </strong>

              <span>
                Confirmar por WhatsApp
              </span>
            </div>

            <WhatsAppButton
              person={invitation.parents.dad}
              number={invitation.whatsapp.dad}
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <img
          src={footerImage}
          alt="Decoración final de la invitación"
        />
      </footer>

    </main>
  )
}

export default App