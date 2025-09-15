import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Brand colors from the project
const BRAND_COLOR = '#37d388';
const BRAND_LIGHT = '#a4e6c5';
const BACKGROUND_COLOR = '#ffffff';
const TEXT_PRIMARY = '#1f2937';
const TEXT_SECONDARY = '#374151';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'You Build It';
    const description =
      searchParams.get('description') || 'Learn by Building Real Applications';
    const type = searchParams.get('type') || 'home';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const skills = searchParams.get('skills');

    const isChallenge = type === 'challenge';
    const isChallengesListing = type === 'challenges';

    return new ImageResponse(
      (
        <div
          style={{
            background: `linear-gradient(135deg, ${BACKGROUND_COLOR} 0%, ${BRAND_LIGHT}15 100%)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '60px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: `radial-gradient(circle at 20% 80%, ${BRAND_COLOR} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${BRAND_COLOR} 0%, transparent 50%)`,
            }}
          />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Site Logo */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <rect width="24" height="24" rx="6" fill="#2fbc77" />
                  <path
                    d="M6 8L10 12L6 16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16H18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: TEXT_PRIMARY,
                }}
              >
                You Build It
              </div>
            </div>

            {isChallenge && difficulty && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor:
                      difficulty === 'Beginner'
                        ? '#dcfce7'
                        : difficulty === 'Intermediate'
                          ? '#fef3c7'
                          : '#fecaca',
                    color:
                      difficulty === 'Beginner'
                        ? '#166534'
                        : difficulty === 'Intermediate'
                          ? '#92400e'
                          : '#991b1b',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {difficulty}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flex: 1,
              width: '100%',
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: isChallenge ? '48px' : '56px',
                fontWeight: 'bold',
                color: TEXT_PRIMARY,
                lineHeight: 1.1,
                marginBottom: '24px',
                maxWidth: '80%',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '24px',
                color: TEXT_SECONDARY,
                lineHeight: 1.4,
                maxWidth: '85%',
                marginBottom: isChallenge ? '32px' : '0',
              }}
            >
              {description}
            </p>

            {isChallenge && (category || skills) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                {category && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: `${BRAND_COLOR}20`,
                      borderRadius: '16px',
                      fontSize: '18px',
                      color: '#166534',
                      fontWeight: '600',
                    }}
                  >
                    <span>📂</span>
                    {category}
                  </div>
                )}

                {skills && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: `${TEXT_SECONDARY}15`,
                      borderRadius: '16px',
                      fontSize: '18px',
                      color: TEXT_SECONDARY,
                      fontWeight: '500',
                    }}
                  >
                    <span>🏷️</span>
                    {skills}
                  </div>
                )}
              </div>
            )}

            {isChallengesListing && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  alignItems: 'center',
                  marginTop: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '20px',
                    fontSize: '16px',
                    color: '#166534',
                    fontWeight: '600',
                  }}
                >
                  <span>🟢</span>
                  Beginner
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '20px',
                    fontSize: '16px',
                    color: '#92400e',
                    fontWeight: '600',
                  }}
                >
                  <span>🟡</span>
                  Intermediate
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: '#fecaca',
                    borderRadius: '20px',
                    fontSize: '16px',
                    color: '#991b1b',
                    fontWeight: '600',
                  }}
                >
                  <span>🔴</span>
                  Advanced
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: TEXT_SECONDARY,
              }}
            >
              {isChallenge
                ? 'Coding Challenge'
                : isChallengesListing
                  ? 'Browse All Coding Challenges'
                  : 'Learn by Building Real Applications'}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '18px',
                color: BRAND_COLOR,
                fontWeight: '600',
              }}
            >
              youbuildit.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error(`Failed to generate OG image: ${message}`);
    return new Response(`Failed to generate image: ${message}`, {
      status: 500,
    });
  }
}
